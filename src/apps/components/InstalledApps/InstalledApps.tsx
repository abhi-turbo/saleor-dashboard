import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  Typography
} from "@material-ui/core";
import { appUrl } from "@saleor/apps/urls";
import CardTitle from "@saleor/components/CardTitle";
import TablePagination from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { AppsListQuery } from "@saleor/graphql";
import {
  Button,
  DeleteIcon,
  IconButton,
  ResponsiveTable
} from "@saleor/macaw-ui";
import { renderCollection, stopPropagation } from "@saleor/misc";
import { ListProps } from "@saleor/types";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../styles";
import AppsSkeleton from "../AppsSkeleton";
import DeactivatedText from "../DeactivatedText";

export interface InstalledAppsProps extends ListProps {
  appsList: AppsListQuery["apps"]["edges"];
  onRemove: (id: string) => void;
  onRowAboutClick: (id: string) => () => void;
}
const numberOfColumns = 2;

const InstalledApps: React.FC<InstalledAppsProps> = ({
  appsList,
  onRemove,
  settings,
  disabled,
  onNextPage,
  onPreviousPage,
  onRowAboutClick,
  onUpdateListSettings,
  pageInfo,
  ...props
}) => {
  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <Card className={classes.apps}>
      <CardTitle
        title={intl.formatMessage({
          id: "ZeD2TK",
          defaultMessage: "Third-party Apps",
          description: "section header"
        })}
      />
      <ResponsiveTable>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              settings={settings}
              hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
              onNextPage={onNextPage}
              onUpdateListSettings={onUpdateListSettings}
              hasPreviousPage={
                pageInfo && !disabled ? pageInfo.hasPreviousPage : false
              }
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            appsList,
            (app, index) =>
              app ? (
                <TableRowLink
                  key={app.node.id}
                  className={classes.tableRow}
                  href={appUrl(app.node.id)}
                >
                  <TableCell className={classes.colName}>
                    <span data-tc="name" className={classes.appName}>
                      {app.node.name}
                    </span>
                    {!app.node.isActive && (
                      <div className={classes.statusWrapper}>
                        <DeactivatedText />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    {app.node.appUrl && (
                      <Typography
                        className={clsx(classes.text, classes.appUrl)}
                        variant="body2"
                      >
                        {app.node.appUrl}
                      </Typography>
                    )}
                    <Button
                      onClick={stopPropagation(onRowAboutClick(app.node.id))}
                    >
                      <FormattedMessage
                        id="TBaMo2"
                        defaultMessage="About"
                        description="about app"
                      />
                    </Button>
                    <IconButton
                      variant="secondary"
                      color="primary"
                      onClick={stopPropagation(() => onRemove(app.node.id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRowLink>
              ) : (
                <AppsSkeleton key={index} />
              ),
            () => (
              <TableRow className={classes.tableRow}>
                <TableCell className={classes.colName}>
                  <Typography className={classes.text} variant="body2">
                    <FormattedMessage
                      id="9tgY4G"
                      defaultMessage="You don’t have any installed apps in your dashboard"
                      description="apps content"
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

InstalledApps.displayName = "InstalledApps";
export default InstalledApps;
